# 使用官方 Nginx 镜像作为基础镜像
FROM nginx:alpine
 
# 删除默认的 Nginx 配置文件
RUN rm /etc/nginx/conf.d/default.conf
 
# 将本地的 Nginx 配置文件复制到容器中的相应位置
COPY nginx.conf /etc/nginx/conf.d/default.conf
 
# 将构建后的前端静态文件复制到 Nginx 的 HTML 目录中
COPY ./build/ /usr/share/nginx/html/
