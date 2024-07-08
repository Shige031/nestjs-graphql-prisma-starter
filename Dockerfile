FROM node:20.11.1 AS builder

WORKDIR /app

ENV NODE_ENV production

# package.jsonとpackage-lock.jsonをコピー
COPY --chown=node:node package*json ./
# prismaディレクトリ以下をコピー
COPY --chown=node:node prisma ./prisma

# 依存関係をインストール
RUN npm ci
# Prisma Clientコードを生成
RUN npm run generate
# node_envがproductionの場合、nest_cliがインストールされないので、追加でインストールする
RUN npm install -g @nestjs/cli

# アプリケーションのソースコードをコピー
COPY --chown=node:node . .

# NestJSアプリケーションをビルド
RUN npm run build

# root以外のユーザー指定
USER node

FROM node:20.11.1-slim

WORKDIR /app

ENV NODE_ENV production

# prismaclientを使用する場合、以下をインストールする必要がある
RUN apt-get -qy update
RUN apt-get -qy install openssl

# buildステージから必要なファイルをコピー
COPY --from=builder --chown=node:node app/package*.json ./
COPY --from=builder --chown=node:node app/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node app/dist/ ./dist/
COPY --from=builder --chown=node:node app/prisma/ ./prisma/
COPY --from=builder --chown=node:node app/start.sh ./

# ディレクトリ所有権を変更
RUN chown -R node:node /app

# 使用ポート指定
EXPOSE 3000

# root以外のユーザー指定
USER node

RUN chmod +x ./start.sh

# アプリケーション起動
CMD [ "./start.sh" ]

