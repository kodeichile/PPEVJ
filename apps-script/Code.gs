const SHEET_NAME = "Productos";
const DRIVE_FOLDER_ID = "PEGA_AQUI_EL_ID_DE_LA_CARPETA";

function doGet(e) {
  const action = e.parameter.action;
  if (action !== "listar") return json_({ ok: false, error: "Accion no soportada" }, 400);

  const admin = verificarToken_(e.parameter.token);
  const products = readProducts_().filter((product) => admin || product.activo === true);
  return json_({ ok: true, products });
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents || "{}");
  if (!verificarToken_(body.token)) return json_({ ok: false, error: "No autorizado" }, 401);

  if (body.action === "crear") return json_(crearProducto_(body.product));
  if (body.action === "actualizar") return json_(actualizarProducto_(body.id, body.product));
  if (body.action === "eliminar") return json_(actualizarProducto_(body.id, { activo: false }));
  if (body.action === "subir_imagen") return json_(subirImagen_(body));

  return json_({ ok: false, error: "Accion no soportada" }, 400);
}

function verificarToken_(token) {
  return token && token === PropertiesService.getScriptProperties().getProperty("API_TOKEN");
}

function sheet_() {
  const spreadsheet = SpreadsheetApp.getActive();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["id", "nombre", "precio", "imagen_url", "descripcion", "activo", "fecha_creacion"]);
  }
  return sheet;
}

function readProducts_() {
  const values = sheet_().getDataRange().getValues();
  const headers = values.shift();
  return values.filter((row) => row[0]).map((row) => {
    const product = {};
    headers.forEach((header, index) => product[header] = row[index]);
    product.precio = Number(product.precio) || 0;
    product.activo = product.activo === true || String(product.activo).toUpperCase() === "TRUE";
    return product;
  });
}

function crearProducto_(product) {
  const id = product.id || Utilities.getUuid();
  sheet_().appendRow([
    id,
    product.nombre || "",
    Number(product.precio) || 0,
    product.imagen_url || "",
    product.descripcion || "",
    product.activo !== false,
    new Date().toISOString()
  ]);
  return { ok: true, product: Object.assign({}, product, { id }) };
}

function actualizarProducto_(id, updates) {
  const sheet = sheet_();
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idColumn = headers.indexOf("id");
  const rowIndex = values.findIndex((row, index) => index > 0 && row[idColumn] === id);

  if (rowIndex < 1) return { ok: false, error: "Producto no encontrado" };

  Object.keys(updates || {}).forEach((key) => {
    const column = headers.indexOf(key);
    if (column >= 0) sheet.getRange(rowIndex + 1, column + 1).setValue(updates[key]);
  });

  return { ok: true };
}

function subirImagen_(body) {
  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  const bytes = Utilities.base64Decode(body.imagenBase64);
  const blob = Utilities.newBlob(bytes, body.mimeType || "image/jpeg", body.nombreArchivo || "producto.jpg");
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return { ok: true, url: "https://drive.google.com/uc?export=view&id=" + file.getId() };
}

function json_(data, status) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
