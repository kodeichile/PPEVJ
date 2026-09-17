export type Product = {
  id: string;
  nombre: string;
  precio: number;
  imagen_url: string;
  descripcion: string;
  activo: boolean;
  categoria?: string;
  orden?: number;
  destacado?: boolean;
  destacado_orden?: number;
  fecha_creacion?: string;
};

export const fallbackProducts: Product[] = [
  {
    "id": "limonero-2-m-1",
    "imagen_url": "/catalogo-img/limonero-2-m-1.gif",
    "nombre": "Limonero (2 m)",
    "descripcion": "Altura disponible: 2 m. Precio actualizado Julio 2026.",
    "precio": 15000,
    "activo": true
  },
  {
    "id": "mandarino-1-5-m-2",
    "imagen_url": "/catalogo-img/mandarino-1-5-m-2.gif",
    "nombre": "Mandarino (1,5 m)",
    "descripcion": "Altura disponible: 1,5 m. Precio actualizado Julio 2026.",
    "precio": 12000,
    "activo": true
  },
  {
    "id": "naranjo-1-5-m-3",
    "imagen_url": "/catalogo-img/naranjo-1-5-m-3.gif",
    "nombre": "Naranjo (1,5 m)",
    "descripcion": "Altura disponible: 1,5 m. Precio actualizado Julio 2026.",
    "precio": 12000,
    "activo": true
  },
  {
    "id": "paltos-1-m-4",
    "imagen_url": "/catalogo-img/paltos-1-m-4.gif",
    "nombre": "Paltos (1 m)",
    "descripcion": "Altura disponible: 1 m. Precio actualizado Julio 2026.",
    "precio": 10000,
    "activo": true
  },
  {
    "id": "nispero-1-2-m-5",
    "imagen_url": "/catalogo-img/nispero-1-2-m-5.gif",
    "nombre": "Nispero (1,2 m)",
    "descripcion": "Altura disponible: 1,2 m. Precio actualizado Julio 2026.",
    "precio": 8000,
    "activo": true
  },
  {
    "id": "abutilon-40-cm-6",
    "imagen_url": "/catalogo-img/abutilon-40-cm-6.gif",
    "nombre": "Abutilón (40 cm)",
    "descripcion": "Altura disponible: 40 cm. Precio actualizado Julio 2026.",
    "precio": 6500,
    "activo": true
  },
  {
    "id": "pino-azul-30-cm-7",
    "imagen_url": "/catalogo-img/pino-azul-30-cm-7.gif",
    "nombre": "Pino Azul (30 cm)",
    "descripcion": "Altura disponible: 30 cm. Precio actualizado Julio 2026.",
    "precio": 7000,
    "activo": true
  },
  {
    "id": "pino-azul-1-m-8",
    "imagen_url": "/catalogo-img/pino-azul-1-m-8.gif",
    "nombre": "Pino Azul (1 m)",
    "descripcion": "Altura disponible: 1 m. Precio actualizado Julio 2026.",
    "precio": 15000,
    "activo": true
  },
  {
    "id": "arrayan-30-cm-9",
    "imagen_url": "/catalogo-img/arrayan-30-cm-9.gif",
    "nombre": "Arrayán (30 cm)",
    "descripcion": "Altura disponible: 30 cm. Precio actualizado Julio 2026.",
    "precio": 2000,
    "activo": true
  },
  {
    "id": "abelia-70-cm-10",
    "imagen_url": "/catalogo-img/abelia-70-cm-10.gif",
    "nombre": "Abelia (70 cm)",
    "descripcion": "Altura disponible: 70 cm. Precio actualizado Julio 2026.",
    "precio": 7000,
    "activo": true
  },
  {
    "id": "abelia-30-cm-11",
    "imagen_url": "/catalogo-img/abelia-30-cm-11.gif",
    "nombre": "Abelia (30 cm)",
    "descripcion": "Altura disponible: 30 cm. Precio actualizado Julio 2026.",
    "precio": 3000,
    "activo": true
  },
  {
    "id": "azaleas-40-cm-12",
    "imagen_url": "/catalogo-img/azaleas-40-cm-12.gif",
    "nombre": "Azaleas (40 cm)",
    "descripcion": "Altura disponible: 40 cm. Precio actualizado Julio 2026.",
    "precio": 8000,
    "activo": true
  },
  {
    "id": "boj-15-cm-13",
    "imagen_url": "/catalogo-img/boj-15-cm-13.gif",
    "nombre": "Boj (15 cm)",
    "descripcion": "Altura disponible: 15 cm. Precio actualizado Julio 2026.",
    "precio": 3000,
    "activo": true
  },
  {
    "id": "camelia-30-cm-14",
    "imagen_url": "/catalogo-img/camelia-30-cm-14.gif",
    "nombre": "Camelia (30 cm)",
    "descripcion": "Altura disponible: 30 cm. Precio actualizado Julio 2026.",
    "precio": 8000,
    "activo": true
  },
  {
    "id": "camelia-60-cm-15",
    "imagen_url": "/catalogo-img/camelia-60-cm-15.gif",
    "nombre": "Camelia (60 cm)",
    "descripcion": "Altura disponible: 60 cm. Precio actualizado Julio 2026.",
    "precio": 12000,
    "activo": true
  },
  {
    "id": "chilco-25-cm-16",
    "imagen_url": "/catalogo-img/chilco-25-cm-16.gif",
    "nombre": "Chilco (25 cm)",
    "descripcion": "Altura disponible: 25 cm. Precio actualizado Julio 2026.",
    "precio": 3000,
    "activo": true
  },
  {
    "id": "coprosma-nigra-25-cm-17",
    "imagen_url": "/catalogo-img/coprosma-nigra-25-cm-17.gif",
    "nombre": "Coprosma Nigra (25 cm)",
    "descripcion": "Altura disponible: 25 cm. Precio actualizado Julio 2026.",
    "precio": 4000,
    "activo": true
  },
  {
    "id": "coprosma-sunrise-25-cm-18",
    "imagen_url": "/catalogo-img/coprosma-sunrise-25-cm-18.gif",
    "nombre": "Coprosma Sunrise (25 cm)",
    "descripcion": "Altura disponible: 25 cm. Precio actualizado Julio 2026.",
    "precio": 4000,
    "activo": true
  },
  {
    "id": "coprosma-inferno-25-cm-19",
    "imagen_url": "/catalogo-img/coprosma-inferno-25-cm-19.gif",
    "nombre": "Coprosma Inferno (25 cm)",
    "descripcion": "Altura disponible: 25 cm. Precio actualizado Julio 2026.",
    "precio": 4000,
    "activo": true
  },
  {
    "id": "fosforito-25-cm-20",
    "imagen_url": "/catalogo-img/fosforito-25-cm-20.gif",
    "nombre": "Fosforito (25 cm)",
    "descripcion": "Altura disponible: 25 cm. Precio actualizado Julio 2026.",
    "precio": 3000,
    "activo": true
  },
  {
    "id": "jazmin-enredadera-70-cm-21",
    "imagen_url": "/catalogo-img/jazmin-enredadera-70-cm-21.gif",
    "nombre": "Jazmín enredadera (70 cm)",
    "descripcion": "Altura disponible: 70 cm. Precio actualizado Julio 2026.",
    "precio": 7000,
    "activo": true
  },
  {
    "id": "laurel-flor-80-cm-22",
    "imagen_url": "/catalogo-img/laurel-flor-80-cm-22.gif",
    "nombre": "Laurel Flor (80 cm)",
    "descripcion": "Altura disponible: 80 cm. Precio actualizado Julio 2026.",
    "precio": 8000,
    "activo": true
  },
  {
    "id": "laurentina-30-cm-23",
    "imagen_url": "/catalogo-img/laurentina-30-cm-23.gif",
    "nombre": "Laurentina (30 cm)",
    "descripcion": "Altura disponible: 30 cm. Precio actualizado Julio 2026.",
    "precio": 5000,
    "activo": true
  },
  {
    "id": "laurentina-60-cm-24",
    "imagen_url": "/catalogo-img/laurentina-60-cm-24.gif",
    "nombre": "Laurentina (60 cm)",
    "descripcion": "Altura disponible: 60 cm. Precio actualizado Julio 2026.",
    "precio": 8000,
    "activo": true
  },
  {
    "id": "lavanda-40-cm-25",
    "imagen_url": "/catalogo-img/lavanda-40-cm-25.gif",
    "nombre": "Lavanda (40 cm)",
    "descripcion": "Altura disponible: 40 cm. Precio actualizado Julio 2026.",
    "precio": 3000,
    "activo": true
  },
  {
    "id": "palmera-40-cm-26",
    "imagen_url": "/catalogo-img/palmera-40-cm-26.gif",
    "nombre": "Palmera (40 cm)",
    "descripcion": "Altura disponible: 40 cm. Precio actualizado Julio 2026.",
    "precio": 7000,
    "activo": true
  },
  {
    "id": "paquerete-60-cm-27",
    "imagen_url": "/catalogo-img/paquerete-60-cm-27.gif",
    "nombre": "Paquerete (60 cm)",
    "descripcion": "Altura disponible: 60 cm. Precio actualizado Julio 2026.",
    "precio": 4000,
    "activo": true
  },
  {
    "id": "rododendro-30-cm-28",
    "imagen_url": "/catalogo-img/rododendro-30-cm-28.gif",
    "nombre": "Rododendro (30 cm)",
    "descripcion": "Altura disponible: 30 cm. Precio actualizado Julio 2026.",
    "precio": 8000,
    "activo": true
  },
  {
    "id": "romero-30-cm-29",
    "imagen_url": "/catalogo-img/romero-30-cm-29.gif",
    "nombre": "Romero (30 cm)",
    "descripcion": "Altura disponible: 30 cm. Precio actualizado Julio 2026.",
    "precio": 2000,
    "activo": true
  },
  {
    "id": "veronica-buxifolia-30-cm-30",
    "imagen_url": "/catalogo-img/veronica-buxifolia-30-cm-30.gif",
    "nombre": "Verónica Buxifolia (30 cm)",
    "descripcion": "Altura disponible: 30 cm. Precio actualizado Julio 2026.",
    "precio": 3000,
    "activo": true
  },
  {
    "id": "veronica-colombiana-25-cm-31",
    "imagen_url": "/catalogo-img/veronica-colombiana-25-cm-31.gif",
    "nombre": "Verónica Colombiana (25 cm)",
    "descripcion": "Altura disponible: 25 cm. Precio actualizado Julio 2026.",
    "precio": 3500,
    "activo": true
  },
  {
    "id": "veronica-variegada-30-cm-32",
    "imagen_url": "/catalogo-img/veronica-variegada-30-cm-32.gif",
    "nombre": "Verónica Variegada (30 cm)",
    "descripcion": "Altura disponible: 30 cm. Precio actualizado Julio 2026.",
    "precio": 4000,
    "activo": true
  },
  {
    "id": "dafne-odorosa-70-cm-33",
    "imagen_url": "/catalogo-img/dafne-odorosa-70-cm-33.gif",
    "nombre": "Dafne odorosa (70 cm)",
    "descripcion": "Altura disponible: 70 cm. Precio actualizado Julio 2026.",
    "precio": 25000,
    "activo": true
  }
];
