// CSVファイルのパスを指定
var csvFilePath = 'data.csv';

// 地図を表示するための関数
function initMap() {
    // 地図の表示領域を指定
    var map = L.map('map').setView([35.373688,139.46843], 12); 

    // OpenStreetMapのタイルレイヤーを追加
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 16
    }).addTo(map);

    var dropdown = document.getElementById('target');
    dropdown.addEventListener('change',async function() {
        // 選択された主たる対象者を取得
        var selectedTarget = dropdown.value;

        // マーカーを一旦削除
        map.eachLayer(function(layer) {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        var csvData = await getCSVData("data.csv")
        // 選択された主たる対象者に該当するデータのみマーカーを表示する
        for (var i = 1; i < csvData.length; i++) {
            var row = csvData[i];
            var target = csvData[0].indexOf(selectedTarget); // 主たる対象者のカラム

            if (row[target] === '○') {
                var latLng = L.latLng(parseFloat(row[30]), parseFloat(row[31])); // 緯度と経度のカラム
                var marker = L.marker(latLng).addTo(map);

                // マーカーをクリックした際に情報を表示するポップアップを作成
                var info = '<ul><li>' + row[1] + '</li><li>' + row[2] + '</li><li>' + row[14] + '</li><li>' + row[15] + '</li><li>' + row[20] + '</li><li>' + row[21] + '</li><li>' + row[23] + '</li></ul>'; // 表示する情報のカラム
                marker.bindPopup(info);
            }
        }
    });    
}

async function getCSVData(csvFilePath){
    // CSVファイルの読み込み
        return fetch(csvFilePath)
        .then(response => response.text())
        .then(data => {
            // CSVデータを配列に変換
            var csvData = CSVToArray(data,",");
            return csvData
            // ドロップダウンの値が変更された時のイベントリスナーを追加 
        });      
}

// CSVデータを配列に変換する関数
function CSVToArray(strData, strDelimiter) {
    strDelimiter = strDelimiter || ',';

    var objPattern = new RegExp(
        '(\\' + strDelimiter + '|\\r?\\n|\\r|^)' +
        '(?:"([^"]*(?:""[^"]*)*)"|' +
        '([^"\\' + strDelimiter + '\\r\\n]*))',
        'gi'
    );

    var arrData = [[]];
    var arrMatches = null;
    while (arrMatches = objPattern.exec(strData)) {
        var strMatchedDelimiter = arrMatches[1];
        if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
            arrData.push([]);
        }

        var strMatchedValue;
        if (arrMatches[2]) {
            strMatchedValue = arrMatches[2].replace(
                new RegExp('""', 'g'), '"');
        } else {
            strMatchedValue = arrMatches[3];
        }

        arrData[arrData.length - 1].push(strMatchedValue);
    }

    return arrData;
}

// 地図を表示する
initMap();