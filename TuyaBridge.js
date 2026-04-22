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
            text: "Make sure your Python bridge is running at http://localhost:5000 then click Add Device."
            font.pixelSize: 13
            font.family: "Poppins"
            width: parent.width
            wrapMode: Text.WordWrap
        }

        Item {
            Rectangle {
                width: 120
                height: 30
                color: "#003000"
                radius: 2
            }
            width: 120
            height: 30
            ToolButton {
                height: 30
                width: 120
                font.family: "Poppins"
                font.bold: true
                text: "Add Device"
                onClicked: {
                    service.triggerDiscovery();
                }
            }
        }
    }
}
