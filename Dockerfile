# ʹ�ùٷ� Nginx ������Ϊ��������
FROM nginx:alpine
 
# ɾ��Ĭ�ϵ� Nginx �����ļ�
RUN rm /etc/nginx/conf.d/default.conf
 
# �����ص� Nginx �����ļ����Ƶ������е���Ӧλ��
COPY nginx.conf /etc/nginx/conf.d/default.conf
 
# ���������ǰ�˾�̬�ļ����Ƶ� Nginx �� HTML Ŀ¼��
COPY ./dist/ /usr/share/nginx/html/