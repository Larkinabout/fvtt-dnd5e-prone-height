const MODULE_ID = 'dnd5e-prone-height'
const WALL_HEIGHT_ID = 'wall-height'

Hooks.on('preCreateActiveEffect', async (activeEffect, data, options, userId) => {
    updateTokenHeight('create', activeEffect, data)
})

Hooks.on('preDeleteActiveEffect', async (activeEffect, data, userId) => {
    updateTokenHeight('delete', activeEffect, data)
})

function updateTokenHeight (type, activeEffect, data) {
    if (!game.modules.get(WALL_HEIGHT_ID).active) return
    const isProne = (type === 'create')
        ? data.statuses.some(status => status === 'prone')
        : activeEffect.statuses.some(status => status === 'prone')
    if (!isProne) return

    const token = game.scenes.current.tokens.find(token => token.actor.id === activeEffect.parent?.id)
    if (!token) return

    if (type === 'create') {
        const tokenHeight = token.getFlag(WALL_HEIGHT_ID, 'tokenHeight')
        token.setFlag(MODULE_ID, 'originalTokenHeight', tokenHeight)

        const proneTokenHeight = (tokenHeight || WallHeight._defaultTokenHeight) / 3

        token.setFlag(WALL_HEIGHT_ID, 'tokenHeight', proneTokenHeight)
    } else {
        const originalTokenHeight = token.getFlag(MODULE_ID, 'originalTokenHeight')
        if (!originalTokenHeight && originalTokenHeight !== 0) return

        token.setFlag(WALL_HEIGHT_ID, 'tokenHeight', originalTokenHeight)
    }
}
