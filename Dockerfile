# Imagine oficială ultrasimplă NGINX (100% nativ, 0 Javascript, 0 Angular)
FROM nginx:alpine

# Suprascriem portul din 80(default pt net) în 3000(pt cerința Home Assistant și preview)
RUN sed -i 's/listen  *80;/listen 3000;/g' /etc/nginx/conf.d/default.conf

# Ștergem ce avea NGINX din fabrica in folder
RUN rm -rf /usr/share/nginx/html/*

# Copiem doar cele 3 fisiere magice pure create
COPY index.html style.css app.js /usr/share/nginx/html/

# Port exposure
EXPOSE 3000

# Executam Nginx
CMD ["nginx", "-g", "daemon off;"]
