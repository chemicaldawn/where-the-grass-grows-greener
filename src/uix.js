export function Bullet(text, style) {
    var container = ui.Panel()
    container.setLayout(ui.Panel.Layout.flow("horizontal", false))
    container.add(ui.Label({
        value: " • ",
        style: style
    }))
    container.add(ui.Label({
        value: text,
        style: style
    }))
    return container
}