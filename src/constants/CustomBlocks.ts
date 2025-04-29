// customBlocks.js

export const customBlocks = [
    {
      id: 'text',
      label: 'Texto',
      media: `<svg style="width:48px;height:48px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z" />
      </svg>`,
      content: '<div style="padding: 10px; text-align: center;">Texto editable</div>',
    },
    {
        id: 'image',
        label: 'Imagen',
        media: `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
    </svg>`,
        content: `<img src="https://via.placeholder.com/150" style="width: 100%; height: auto;" />`,
    },
    {
      id: 'button',
      label: 'Botón',
      media: `<svg style="width:48px;height:48px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M10,17V14H3V10H10V7L15,12L10,17Z" />
      </svg>`,
      content: '<button style="padding: 10px 20px; font-size: 16px;">Click aquí</button>',
    },
    {
      id: 'card',
      label: 'Tarjeta',
      media: `<svg style="width:48px;height:48px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M3,4H21A2,2 0 0,1 23,6V18A2,2 0 0,1 21,20H3A2,2 0 0,1 1,18V6A2,2 0 0,1 3,4M21,18V8H3V18H21Z" />
      </svg>`,
      content: `
        <div style="border: 1px solid #ccc; padding: 15px; border-radius: 8px;">
          <h3 style="margin-top: 0;">Título de la tarjeta</h3>
          <p>Este es un párrafo dentro de una tarjeta. Puedes editarlo.</p>
        </div>`,
    },
    {
      id: 'contact-form',
      label: 'Formulario',
      media: `<svg style="width:48px;height:48px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M3,4H21A2,2 0 0,1 23,6V18A2,2 0 0,1 21,20H3A2,2 0 0,1 1,18V6A2,2 0 0,1 3,4M21,18V8H3V18H21Z" />
      </svg>`,
      content: `
        <form style="padding: 15px; border: 1px solid #ccc; border-radius: 8px;">
          <h3 style="margin-top: 0;">Contáctanos</h3>
          <input type="text" placeholder="Nombre" style="width: 100%; padding: 8px; margin-bottom: 10px;" />
          <input type="email" placeholder="Correo electrónico" style="width: 100%; padding: 8px; margin-bottom: 10px;" />
          <textarea placeholder="Mensaje" style="width: 100%; padding: 8px; margin-bottom: 10px;"></textarea>
          <button type="submit" style="padding: 10px 20px;">Enviar</button>
        </form>
      `,
    },
    {
      id: 'simple-slider',
      label: 'Slider',
      media: `<svg style="width:48px;height:48px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M2,3H22V21H2V3M20,5H4V19H20V5M6,7H18V9H6V7M6,11H14V13H6V11M6,15H12V17H6V15Z" />
      </svg>`,
      content: `
        <div class="slider" style="width: 100%; overflow: hidden;">
          <div style="display: flex; transition: transform 0.5s ease;">
            <img src="https://via.placeholder.com/600x200?text=Slide+1" style="width: 100%;" />
            <img src="https://via.placeholder.com/600x200?text=Slide+2" style="width: 100%;" />
            <img src="https://via.placeholder.com/600x200?text=Slide+3" style="width: 100%;" />
          </div>
        </div>
      `,
    },
    {
      id: 'testimonial',
      label: 'Testimonio',
      media: `<svg style="width:48px;height:48px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M9,11.5C9,13.43 7.43,15 5.5,15A2.5,2.5 0 0,1 3,12.5C3,10.57 4.57,9 6.5,9A2.5,2.5 0 0,1 9,11.5M15,9C16.93,9 18.5,10.57 18.5,12.5A2.5,2.5 0 0,1 16,15C14.07,15 12.5,13.43 12.5,11.5A2.5,2.5 0 0,1 15,9Z" />
      </svg>`,
      content: `
        <div style="border: 1px solid #eee; border-radius: 8px; padding: 20px; text-align: center;">
          <p style="font-style: italic;">"Este producto cambió mi vida. ¡Altamente recomendado!"</p>
          <p><strong>- Juan Pérez</strong></p>
        </div>
      `,
    },
    {
      id: 'team-card',
      label: 'Miembro del equipo',
      media: `<svg style="width:48px;height:48px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12,19.2C14.5,17.6 16,15 16,12A4,4 0 0,0 12,8A4,4 0 0,0 8,12C8,15 9.5,17.6 12,19.2M4,22V20C4,17.8 9.3,16.5 12,16.5C14.7,16.5 20,17.8 20,20V22H4Z" />
      </svg>`,
      content: `
        <div style="text-align: center; border: 1px solid #ddd; border-radius: 10px; padding: 15px;">
          <img src="https://via.placeholder.com/100" style="border-radius: 50%; margin-bottom: 10px;" />
          <h4>Laura Gómez</h4>
          <p>Desarrolladora Frontend</p>
        </div>
      `,
    },
    {
      id: 'footer',
      label: 'Pie de página',
      media: `<svg style="width:48px;height:48px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M2,3H22V5H2V3M2,19H22V21H2V19M2,15H22V17H2V15M2,11H22V13H2V11M2,7H22V9H2V7Z" />
      </svg>`,
      content: `
        <footer style="background: #333; color: white; text-align: center; padding: 20px;">
          <p>&copy; 2025 Mi Sitio. Todos los derechos reservados.</p>
        </footer>
      `,
    }
  ];
  