api-openurl 
![Status](https://img.shields.io/badge/%E3%82%B9%E3%83%86%E3%83%BC%E3%82%BF%E3%82%B9-%E9%81%8B%E7%94%A8%E4%B8%AD-brightgreen
)
=========================================================================================================================================================================================
カーリルのウェブサービス用の書影輝度取得エンドポイント

概要
-----

- トップページの蔵書状況のスタイルを書影の輝度によって変えるために使用
- ISBNの配列を受け、書影のHSLを返す

運用とデプロイ
----
- [Google Cloud Functions](https://console.cloud.google.com/functions/details/asia-northeast1/api-openurl?project=libmuteki2)
- [Cloud Source Repositories](https://source.cloud.google.com/libmuteki2/github_calil_api-image-lightness) (Githubと同期)
- GitHubにプッシュしたあと、Google Cloud Functionsの編集ページからデプロイ

運用中のサービス
----
- https://api.calil.jp/openurl?isbn=9784479795902
- https://asia-northeast1-libmuteki2.cloudfunctions.net/api-openurl?isbn=9784479795902
