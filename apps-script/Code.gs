const PRODUCT_SHEET_NAME = "Productos";
const CATEGORY_SHEET_NAME = "Categorias";
const DEFAULT_DRIVE_FOLDER_ID = "1f2g3Qv7iT_qfND7KplLwNtzHUIC1jKqW";

const PRODUCT_HEADERS = [
  "id",
  "nombre",
  "descripcion",
  "precio",
  "categoria",
  "orden",
  "activo",
  "imagen_url",
  "created_at",
  "updated_at"
];

const CATEGORY_HEADERS = ["nombre", "orden", "activo", "created_at", "updated_at"];
const DEFAULT_CATEGORIES = ["Frutales", "Árboles Ornamentales", "Arbustos", "Flores", "Árboles", "Aromáticas"];

function doGet(e) {
  try {
    const action = String(e.parameter.action || "listar");
    const admin = verificarToken_(e.parameter.token);

    if (action === "listar") {
      const products = readProducts_().filter((product) => admin || product.activo === true);
      return json_({ ok: true, products });
    }

    if (action === "listar_categorias") {
      if (!admin) return json_({ ok: false, error: "No autorizado. Revisa API_TOKEN en Apps Script y APPSCRIPT_TOKEN en Vercel." }, 401);
      return json_({ ok: true, categories: readCategories_() });
    }

    return json_({ ok: false, error: "Acción no soportada: " + action }, 400);
  } catch (error) {
    return json_({ ok: false, error: friendlyError_(error) }, 500);
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    if (!verificarToken_(body.token)) {
      return json_({ ok: false, error: "No autorizado. Revisa API_TOKEN en Apps Script y APPSCRIPT_TOKEN en Vercel." }, 401);
    }

    if (body.action === "crear") return json_(crearProducto_(body.product || {}));
    if (body.action === "actualizar") return json_(actualizarProducto_(body.id, body.product || {}));
    if (body.action === "eliminar") return json_(actualizarProducto_(body.id, { activo: false }));
    if (body.action === "subir_imagen") return json_(subirImagen_(body));
    if (body.action === "crear_categoria") return json_(crearCategoria_(body.category || {}));
    if (body.action === "renombrar_categoria") return json_(renombrarCategoria_(body.nombre, body.nuevoNombre));
    if (body.action === "eliminar_categoria") return json_(eliminarCategoria_(body.nombre));

    return json_({ ok: false, error: "Acción no soportada: " + body.action }, 400);
  } catch (error) {
    return json_({ ok: false, error: friendlyError_(error) }, 500);
  }
}

function verificarToken_(token) {
  return token && token === PropertiesService.getScriptProperties().getProperty("API_TOKEN");
}

function spreadsheet_() {
  const sheetId = PropertiesService.getScriptProperties().getProperty("SHEET_ID");
  if (sheetId) return SpreadsheetApp.openById(sheetId);
  return SpreadsheetApp.getActive();
}

function productsSheet_() {
  return ensureSheet_(PRODUCT_SHEET_NAME, PRODUCT_HEADERS);
}

function categoriesSheet_() {
  const sheet = ensureSheet_(CATEGORY_SHEET_NAME, CATEGORY_HEADERS);
  seedDefaultCategories_(sheet);
  return sheet;
}

function ensureSheet_(sheetName, headers) {
  const spreadsheet = spreadsheet_();
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) sheet = spreadsheet.insertSheet(sheetName);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    return sheet;
  }

  const currentHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  headers.forEach((header) => {
    if (currentHeaders.indexOf(header) === -1) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(header);
    }
  });
  return sheet;
}

function readProducts_() {
  const values = productsSheet_().getDataRange().getValues();
  const headers = values.shift() || [];
  return values.filter((row) => row[headers.indexOf("id")]).map((row) => {
    const product = {};
    headers.forEach((header, index) => product[header] = row[index]);
    product.precio = Number(product.precio) || 0;
    product.orden = Number(product.orden) || 0;
    product.categoria = product.categoria || inferCategory_(product);
    product.activo = product.activo === true || String(product.activo).toUpperCase() === "TRUE";
    return product;
  });
}

function readCategories_() {
  const fromSheet = readCategoriesFromSheet_();
  const labels = {};

  DEFAULT_CATEGORIES.forEach((name, index) => {
    labels[name] = { nombre: name, orden: index + 1, activo: true };
  });

  readProducts_().forEach((product) => {
    const name = product.categoria || inferCategory_(product);
    if (name && !labels[name]) labels[name] = { nombre: name, orden: Object.keys(labels).length + 1, activo: true };
  });

  fromSheet.forEach((category) => {
    labels[category.nombre] = category;
  });

  return Object.keys(labels)
    .map((name) => labels[name])
    .filter((category) => category.activo !== false)
    .sort((a, b) => (Number(a.orden) || 0) - (Number(b.orden) || 0));
}

function readCategoriesFromSheet_() {
  const values = categoriesSheet_().getDataRange().getValues();
  const headers = values.shift() || [];
  return values.filter((row) => row[headers.indexOf("nombre")]).map((row) => {
    const category = {};
    headers.forEach((header, index) => category[header] = row[index]);
    category.orden = Number(category.orden) || 0;
    category.activo = category.activo === true || String(category.activo).toUpperCase() === "TRUE";
    return category;
  });
}

function seedDefaultCategories_(sheet) {
  if (sheet.getLastRow() > 1) return;
  const now = new Date().toISOString();
  DEFAULT_CATEGORIES.forEach((name, index) => {
    sheet.appendRow([name, index + 1, true, now, now]);
  });
}

function crearProducto_(product) {
  const id = product.id || Utilities.getUuid();
  const now = new Date().toISOString();
  const savedProduct = {
    id,
    nombre: product.nombre || "",
    descripcion: product.descripcion || "",
    precio: Number(product.precio) || 0,
    categoria: product.categoria || inferCategory_(Object.assign({}, product, { id })),
    orden: Number(product.orden) || 0,
    activo: product.activo !== false,
    imagen_url: product.imagen_url || "",
    created_at: product.created_at || now,
    updated_at: now
  };

  const sheet = productsSheet_();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  sheet.appendRow(headers.map((header) => savedProduct[header] !== undefined ? savedProduct[header] : ""));
  crearCategoria_({ nombre: savedProduct.categoria });
  return { ok: true, product: savedProduct };
}

function actualizarProducto_(id, updates) {
  const sheet = productsSheet_();
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idColumn = headers.indexOf("id");
  const rowIndex = values.findIndex((row, index) => index > 0 && row[idColumn] === id);

  if (rowIndex < 1) return { ok: false, error: "Producto no encontrado: " + id };

  const nextUpdates = Object.assign({}, updates, { updated_at: new Date().toISOString() });
  Object.keys(nextUpdates || {}).forEach((key) => {
    const column = headers.indexOf(key);
    if (column >= 0) sheet.getRange(rowIndex + 1, column + 1).setValue(nextUpdates[key]);
  });

  if (nextUpdates.categoria) crearCategoria_({ nombre: nextUpdates.categoria });
  return { ok: true };
}

function crearCategoria_(category) {
  const name = String(category.nombre || "").trim();
  if (!name) return { ok: false, error: "Nombre de categoría requerido" };

  const sheet = categoriesSheet_();
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const nameColumn = headers.indexOf("nombre");
  const activeColumn = headers.indexOf("activo");
  const updatedColumn = headers.indexOf("updated_at");
  const existingIndex = values.findIndex((row, index) => index > 0 && String(row[nameColumn]).toLowerCase() === name.toLowerCase());
  const now = new Date().toISOString();

  if (existingIndex > 0) {
    sheet.getRange(existingIndex + 1, activeColumn + 1).setValue(true);
    if (updatedColumn >= 0) sheet.getRange(existingIndex + 1, updatedColumn + 1).setValue(now);
    return { ok: true, category: { nombre: name, activo: true } };
  }

  const order = Number(category.orden) || Math.max(sheet.getLastRow(), 1);
  sheet.appendRow([name, order, true, now, now]);
  return { ok: true, category: { nombre: name, orden: order, activo: true } };
}

function renombrarCategoria_(name, newName) {
  name = String(name || "").trim();
  newName = String(newName || "").trim();
  if (!name || !newName) return { ok: false, error: "Nombre de categoría requerido" };

  const categoryResult = updateCategoryRow_(name, { nombre: newName, activo: true });
  const products = readProducts_().filter((product) => String(product.categoria).toLowerCase() === name.toLowerCase());
  products.forEach((product) => actualizarProducto_(product.id, { categoria: newName }));
  return categoryResult;
}

function eliminarCategoria_(name) {
  name = String(name || "").trim();
  if (!name) return { ok: false, error: "Nombre de categoría requerido" };

  const used = readProducts_().some((product) => product.activo !== false && String(product.categoria).toLowerCase() === name.toLowerCase());
  if (used) return { ok: false, error: "No se puede eliminar una categoría con productos. Mueve o elimina sus productos primero." };

  updateCategoryRow_(name, { activo: false });
  return { ok: true };
}

function updateCategoryRow_(name, updates) {
  const sheet = categoriesSheet_();
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const nameColumn = headers.indexOf("nombre");
  const rowIndex = values.findIndex((row, index) => index > 0 && String(row[nameColumn]).toLowerCase() === name.toLowerCase());
  const now = new Date().toISOString();

  if (rowIndex < 1) {
    const created = crearCategoria_({ nombre: updates.nombre || name });
    if (updates.activo === false) return updateCategoryRow_(updates.nombre || name, updates);
    return created;
  }

  const nextUpdates = Object.assign({}, updates, { updated_at: now });
  Object.keys(nextUpdates).forEach((key) => {
    const column = headers.indexOf(key);
    if (column >= 0) sheet.getRange(rowIndex + 1, column + 1).setValue(nextUpdates[key]);
  });

  return { ok: true, category: Object.assign({ nombre: updates.nombre || name }, updates) };
}

function inferCategory_(product) {
  const id = String(product.id || "").toLowerCase();
  if (["limonero", "mandarino", "naranjo", "paltos", "nispero"].some((token) => id.indexOf(token) >= 0)) return "Frutales";
  if (["abutilon", "pino-azul", "arrayan", "palmera"].some((token) => id.indexOf(token) >= 0)) return "Árboles Ornamentales";
  return "Arbustos";
}

function subirImagen_(body) {
  const folderId = PropertiesService.getScriptProperties().getProperty("DRIVE_FOLDER_ID") || DEFAULT_DRIVE_FOLDER_ID;
  const folder = DriveApp.getFolderById(folderId);
  const bytes = Utilities.base64Decode(body.imagenBase64);
  const blob = Utilities.newBlob(bytes, body.mimeType || "image/jpeg", body.nombreArchivo || "producto.jpg");
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return { ok: true, url: "https://drive.google.com/thumbnail?id=" + file.getId() + "&sz=w1200" };
}

function friendlyError_(error) {
  const message = error && error.message ? error.message : String(error);
  if (/Cannot call SpreadsheetApp.getActive/i.test(message)) {
    return "No se pudo abrir la hoja. Agrega SHEET_ID en Propiedades de la secuencia de comandos.";
  }
  if (/Unexpected token/i.test(message)) {
    return "La solicitud no llegó como JSON válido. Revisa APPSCRIPT_URL en Vercel.";
  }
  if (/Folder|DriveApp|getFolderById/i.test(message)) {
    return "No se pudo acceder a la carpeta de Drive. Revisa DRIVE_FOLDER_ID y permisos.";
  }
  return message;
}

function json_(data, status) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
