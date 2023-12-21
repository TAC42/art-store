export const storageService = {
    post,
    get,
    put,
    remove,
    query,
}

interface EntityId {
    _id: string
}

function query<T>(entityType: string, delay = 200): Promise<T[]> {
    var entities = JSON.parse(localStorage.getItem(entityType) as string) || []
    return new Promise(resolve => setTimeout(() => resolve(entities), delay))
}

async function get<T extends EntityId>(entityType: string, entityId: string): Promise<T> {
    const entities = await query<T>(entityType)
    const entity = entities.find(entity_1 => entity_1._id === entityId)
    if (!entity) throw new Error(`Get failed, cannot find entity with id: ${entityId} in: ${entityType}`)
    return entity
}

async function post<T extends EntityId>(entityType: string, newEntity: T): Promise<T> {
    newEntity = JSON.parse(JSON.stringify(newEntity))
    newEntity._id = _makeId()
    const entities = await query<T>(entityType)
    entities.push(newEntity)
    _save(entityType, entities)
    return newEntity
}

async function put<T extends EntityId>(entityType: string, updatedEntity: T): Promise<T> {
    updatedEntity = JSON.parse(JSON.stringify(updatedEntity))
    const entities = await query<T>(entityType)
    const idx = entities.findIndex(entity => entity._id === updatedEntity._id)
    if (idx < 0) throw new Error(`Update failed, cannot find entity with id: ${updatedEntity._id} in: ${entityType}`)
    entities.splice(idx, 1, updatedEntity)
    _save(entityType, entities)
    return updatedEntity
}

async function remove<T extends EntityId>(entityType: string, entityId: string): Promise<void> {
    const entities = await query<T>(entityType)
    const idx = entities.findIndex(entity => entity._id === entityId)
    if (idx < 0) throw new Error(`Remove failed, cannot find entity with id: ${entityId} in: ${entityType}`)
    entities.splice(idx, 1)
    _save(entityType, entities)

}

// Private functions
function _save<T>(entityType: string, entities: T[]): void {
    localStorage.setItem(entityType, JSON.stringify(entities))
}

function _makeId(length = 5): string {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}