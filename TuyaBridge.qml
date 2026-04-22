Item {
    anchors.fill: parent

    Column {
        y: 10
        width: parent.width - 20
        spacing: 15

        Text {
            color: theme.primarytextcolor
            text: "Tuya RGB Bridge"
            font.pixelSize: 16
            font.family: "Poppins"
            font.bold: true
        }

        Text {
            color: theme.primarytextcolor
            text: "Make sure your Python bridge is running at http://localhost:5000"
            font.pixelSize: 13
            font.family: "Poppins"
            width: parent.width
            wrapMode: Text.WordWrap
        }

        Text {
            color: theme.primarytextcolor
            text: "Status: " + service.getProperty("bridgeStatus")
            font.pixelSize: 13
            font.family: "Poppins"
        }
    }
}