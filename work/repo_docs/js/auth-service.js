import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { auth, authPersistenceReady } from "./firebase-config.js";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const emprendimientos = [
  {
    id: "entre-vinos-jardines",
    nombre: "Entre Vinos y Jardines",
    adminPage: "editor-plantas.html",
    sitePage: "plantas-whatsapp.html",
    pages: ["editor-plantas.html", "plantas-whatsapp.html"],
    // Agrega aqui los correos reales que deben administrar Entre Vinos y Jardines.
    emails: [],
    emailHints: ["moises", "entrevinos", "entre-vinos", "jardin", "jardines", "vivero"]
  },
  {
    id: "la-golondrina",
    nombre: "La Golondrina",
    adminPage: "index.html",
    sitePage: "carrito-whatsapp.html",
    pages: ["index.html", "carrito-whatsapp.html"],
    // Agrega aqui los correos reales que deben administrar La Golondrina.
    emails: [],
    emailHints: ["admin", "golondrina"]
  }
];

export const emprendimientoPorDefecto = emprendimientos.find(item => item.id === "la-golondrina");

function normalizarTexto(value) {
  return String(value || "").trim().toLowerCase();
}

function nombreDePagina(path = window.location.pathname) {
  const clean = String(path || "").split("?")[0].split("#")[0];
  return clean.substring(clean.lastIndexOf("/") + 1) || "index.html";
}

export function obtenerEmprendimientoPorPagina(page = nombreDePagina()) {
  const currentPage = nombreDePagina(page);
  return emprendimientos.find(item => item.pages.includes(currentPage)) || emprendimientoPorDefecto;
}

export function obtenerEmprendimientoDeUsuario(user, fallbackPage = "") {
  const email = normalizarTexto(user && user.email);
  const displayName = normalizarTexto(user && user.displayName);
  const searchable = `${email} ${displayName}`;
  const exact = emprendimientos.find(item => item.emails.map(normalizarTexto).includes(email));
  if (exact) return exact;
  const hinted = emprendimientos.find(item => item.emailHints.some(hint => searchable.includes(hint)));
  if (hinted) return hinted;
  return fallbackPage ? obtenerEmprendimientoPorPagina(fallbackPage) : emprendimientoPorDefecto;
}

export function usuarioPuedeAbrirPagina(user, page) {
  const currentPage = nombreDePagina(page);
  return obtenerEmprendimientoDeUsuario(user, currentPage).pages.includes(currentPage);
}

export function obtenerRutaPrincipalDeUsuario(user, fallbackPage = "") {
  return obtenerEmprendimientoDeUsuario(user, fallbackPage).adminPage;
}

export function traducirErrorFirebase(error) {
  const code = error && error.code ? error.code : "";
  const messages = {
    "auth/invalid-email": "Ingresa un correo electronico valido.",
    "auth/invalid-credential": "No pudimos iniciar sesion con esos datos. Revisa el correo y la contrasena.",
    "auth/wrong-password": "No pudimos iniciar sesion con esos datos. Revisa el correo y la contrasena.",
    "auth/user-disabled": "Esta cuenta esta deshabilitada. Contacta al administrador.",
    "auth/email-already-in-use": "Ese correo ya esta registrado. Intenta iniciar sesion.",
    "auth/weak-password": "La contrasena debe tener al menos 6 caracteres.",
    "auth/too-many-requests": "Hay demasiados intentos. Espera un momento y vuelve a probar.",
    "auth/network-request-failed": "No se pudo conectar. Revisa tu internet e intenta nuevamente.",
    "auth/popup-closed-by-user": "Cerraste la ventana de Google antes de completar el acceso.",
    "auth/popup-blocked": "El navegador bloqueo la ventana de Google. Permite ventanas emergentes para continuar.",
    "auth/unauthorized-domain": "Este dominio no esta autorizado en Firebase Authentication.",
    "auth/account-exists-with-different-credential": "Ese correo ya existe con otro metodo de acceso."
  };
  return messages[code] || "No pudimos completar la solicitud. Intenta nuevamente.";
}

function validarEmailPassword(email, password) {
  if (!String(email || "").trim()) throw new Error("Ingresa tu correo electronico.");
  if (!String(password || "").trim()) throw new Error("Ingresa tu contrasena.");
}

export async function registrarUsuario(email, password, confirmPassword = password) {
  await authPersistenceReady;
  validarEmailPassword(email, password);
  if (password !== confirmPassword) throw new Error("Las contrasenas no coinciden.");
  return createUserWithEmailAndPassword(auth, email.trim(), password);
}

export async function iniciarSesion(email, password) {
  await authPersistenceReady;
  validarEmailPassword(email, password);
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function iniciarSesionConGoogle() {
  await authPersistenceReady;
  return signInWithPopup(auth, googleProvider);
}

export async function recuperarContrasena(email) {
  await authPersistenceReady;
  if (!String(email || "").trim()) throw new Error("Ingresa tu correo electronico.");
  await sendPasswordResetEmail(auth, email.trim());
  return "Si el correo esta registrado, recibiras un enlace para restablecer tu contrasena.";
}

export async function cerrarSesion() {
  await authPersistenceReady;
  return signOut(auth);
}

export function observarSesion(callback) {
  return onAuthStateChanged(auth, callback);
}

export function mostrarErrorSeguro(error) {
  return error && error.code ? traducirErrorFirebase(error) : String(error && error.message ? error.message : "No pudimos completar la solicitud.");
}

export async function ejecutarConCarga(button, loadingText, action) {
  const originalText = button ? button.textContent : "";
  if (button) {
    button.disabled = true;
    button.textContent = loadingText;
  }
  try {
    return await action();
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = originalText;
    }
  }
}
