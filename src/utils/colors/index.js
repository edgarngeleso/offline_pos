export default colors = {
    APP_DEFAULT_COLOR:"#fff",
    APP_DARK_COLOR:"#000000",
    APP_PRIMARY_COLOR:"#ffffff",
    APP_SECONDARY_COLOR:"#b4a1e9",
    light:{
        app_color:"#ffffff",
        danger:"red",
        text_color:"#000000",
        box_color:"#f5f5f5",
        button_color:"#896cda",
        border_color:"#896cda",
        icon_color:"#896cda",
        link_color:"#088008",
        active:"#b4a1e9",
        in_active:"#6c6e71",
        status_bar:"#b4a1e9",
        gray:"#f5f5e5",
    },
    dark:{
        app_color:"#000000",
        danger:"red",
        text_color:"#ffffff",
        box_color:"#282927",
        button_color:"#896cda",
        border_color:"#896cda",
        icon_color:"#a58bed",
        link_color:"#1ab11a",
        active:"#ffffff",
        in_active:"#444e5c",
        status_bar:"#282927",
        gray:"#f5f5e5",
    }
}

export const random_color = () => {
    const values = 'abcdef0123456789';
    let color = '#';
    for (let index = 0; index < 6; index++) {
      const random_index = Math.floor(Math.random() * values.length);
      color += values[random_index];
    }
    return color;
  };