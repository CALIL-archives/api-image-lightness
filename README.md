api-image-lightness
=========================================================================================================================================================================================
カーリルのウェブサービス用の書影輝度取得エンドポイント

概要
-----

- トップページの蔵書状況のスタイルを書影の輝度によって変えるために使用
- ISBNの配列を受け、書影のHSLを返す

運用とデプロイ
----
- [Google Cloud Functions](https://console.cloud.google.com/functions/details/asia-northeast1/api-image-lightness?hl=ja&project=libmuteki2&tab=general)
- [Cloud Source Repositories](https://source.cloud.google.com/libmuteki2/github_calil_api-image-lightness) (Githubと同期)
- GitHubにプッシュしたあと、Google Cloud Functionsの編集ページからデプロイ

運用中のサービス
----
- https://asia-northeast1-libmuteki2.cloudfunctions.net/api-image-lightness?isbns=4101001200,4588622102
