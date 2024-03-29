FROM node:16
LABEL author="caihaifei@enjoytoday.cn"

WORKDIR /app
COPY package.json /app/package.json
RUN npm config set registry https://registry.npmmirror.com
RUN  npm i 
COPY . /app
EXPOSE 7001

CMD  npm run start