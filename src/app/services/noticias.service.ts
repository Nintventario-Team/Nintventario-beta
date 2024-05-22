import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Noticia } from '../interfaces/noticia';

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {
  public notice: Noticia[] = [
    {
        id: 1,
        autor: "John Doe",
        urlImagen: "https://cl.buscafs.com/www.levelup.com/public/uploads/images/832950/832950.png",
        descripcion: "Fue un día como hoy pero de 1999 cuando la industria de los videojuegos conoció un curioso juego de peleas que combinó todas las sagas de Nintendo en una sola propuesta: Super Smash Bros.",
        fechaPublicacion: new Date("2024-01-20T12:30:00Z"),
        titulo: "¡Feliz cumpleaños! Super Smash Bros. celebra sus 25 años de existencia",
    },
    {
        id: 2,
        autor: "Dan Villalobos",
        urlImagen: "https://fs-prod-cdn.nintendo-europe.com/media/images/06_screenshots/games_5/nintendo_switch_6/nswitch_anothercoderecollection/NSwitch_AnotherCodeRecollection_03.jpg",
        descripcion: "Nos llegan buenas noticias para todos los que estaban esperando el regreso de Ashley en Another Code: Recollection, ya que el juego de Nintendo está disponible por fin y listo para ofrecerte una experiencia que seguramente te encantará.",
        fechaPublicacion: new Date("2024-01-19T15:45:00Z"),
        titulo: "Another Code: Recollection ya está disponible",
    },
    {
        id: 3,
        autor: "Ulises Contreras",
        urlImagen: "https://assetsio.reedpopcdn.com/ss_8ef8a16df5e357df5341efdb814192835814107f.jpg?width=1200&height=1200&fit=bounds&quality=70&format=jpg&auto=webp",
        descripcion: "Si algo demostraron juegos como Lethal Company, BattleBit Remastered y Among Us, es que a veces sólo se necesita un concepto interesante para triunfar en esta industria cada vez más competitiva.",
        fechaPublicacion: new Date("2024-01-19T09:00:00Z"),
        titulo: "Palworld, el Pokémon con pistolas, es un éxito de ventas",
    },
    {
      id: 4,
      autor: "Victor Rosas",
      urlImagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCWREwqcF57OOJxkQ3MddFdfHZmprc8nsyMQ&usqp=CAU",
      descripcion: "4 años tuvieron que pasar para que Cyberpunk 2077 lograra la redención después de su desastroso lanzamiento.",
      fechaPublicacion: new Date("2024-01-19T09:00:00Z"),
      titulo: "Gratis: Cyberpunk 2077 tiene una sorpresa",
  },{
    id: 5,
    autor: "Vandal",
    urlImagen: "https://media.vandal.net/i/1280x720/1-2024/12/202411213483116_1.jpg.webp",
    descripcion: "Devil May Cry ha vuelto al ruedo después de varios años sin una nueva entrega en el mercado y lo ha hecho este 10 de enero con Devil May Cry: Peak of Combat, un título gratuito desarrollado por NebulaJoy que ya está disponible en móviles (para Android e ¡OS) y está situándose en lo más alto del top de descargas de las tiendas digitales a una velocidad pasmosa.",
    fechaPublicacion: new Date("2024-01-19T09:00:00Z"),
    titulo: "Devil May Cry: Peak of Combat arrasa en descargas",
},
 
];
  updateNoticias():Noticia[]{
    return this.notice;
  }
}
