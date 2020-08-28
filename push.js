var webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BFGHlVUtsLatZnpJXpUFqLB-6ew8sQ8ZlSU-EL-FUYqrXSnqi2P56z4O1zUK-vgXsCelP0ngY0DIsomy2E5b7xc",
    "privateKey": "B9MYwmTU7Uz8jdWoAt6OJsHyXcxOGeK5u8MK_3ctl-Q"
};


webPush.setVapidDetails(
    'mailto:simonaditia159@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/eyFpN-yl95w:APA91bHm18CZuEo3I-8X31CpcKR85lQvTFgL4lIsHS6GJEwbUQqRYt9Qfob-Gpadew2JZXxRsPXI3wn-MqqZM3nAVPLy78QRiM_cQp4yxXABZsjT6Q3I9OtKt3-xL5cpqLlFLehG9G3s",
    "keys": {
        "p256dh": "BBQfb4CSruQzh1sLdg9nXKACzH0/NpwEY9FUmS4QAVmxhHlYMKwYuaX8/GQO9hsaQ/wyhalDWo3WveF63TLk0l4=",
        "auth": "3Qc0C2KqDO2Dy5V5KeXFzg=="
    }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

var options = {
    gcmAPIKey: '762831916510',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);