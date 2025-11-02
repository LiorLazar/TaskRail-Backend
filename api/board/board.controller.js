import { logger } from '../../services/logger.service.js'
import { boardService } from './board.service.js'

export async function getBoards(req, res) {
    try {
        const filterBy = {
            txt: req.query.txt || '',
            sortField: req.query.sortField || '',
            sortDir: req.query.sortDir || 1,
            pageIdx: req.query.pageIdx,
        }
        const boards = await boardService.query(filterBy)
        res.json(boards)
    } catch (err) {
        logger.error('Failed to get boards', err)
        res.status(400).send({ err: 'Failed to get boards' })
    }
}

export async function getBoardById(req, res) {
    try {
        const boardId = req.params.id
        const board = await boardService.getById(boardId)
        
        if (!board) {
            return res.status(404).send({ err: 'Board not found' })
        }
        
        res.json(board)
    } catch (err) {
        logger.error('Failed to get board', err)
        if (err.message === 'Board not found') {
            res.status(404).send({ err: 'Board not found' })
        } else {
            res.status(400).send({ err: 'Failed to get board' })
        }
    }
}

export async function addBoard(req, res) {
    const { loggedinUser, body } = req
    const board = {
        title: body.title,
        backgroundColor: body.backgroundColor,
        groups: body.groups || [],
        activities: body.activities || [],
        labels: body.labels || [],
        members: body.members || [],
        ...body // Include any other properties from the request body
    }
    try {
        board.owner = loggedinUser
        const addedboard = await boardService.add(board)
        res.json(addedboard)
    } catch (err) {
        logger.error('Failed to add board', err)
        res.status(400).send({ err: 'Failed to add board' })
    }
}

export async function updateBoard(req, res) {
    const { loggedinUser, body: board } = req
    const { _id: userId, isAdmin } = loggedinUser

    if (!isAdmin && board.owner._id !== userId) {
        res.status(403).send('Not your board...')
        return
    }

    try {
        const updatedboard = await boardService.update(board)
        res.json(updatedboard)
    } catch (err) {
        logger.error('Failed to update board', err)
        res.status(400).send({ err: 'Failed to update board' })
    }
}

export async function removeBoard(req, res) {
    try {
        const boardId = req.params.id
        const removedId = await boardService.remove(boardId)

        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove board', err)
        res.status(400).send({ err: 'Failed to remove board' })
    }
}

export async function addBoardMsg(req, res) {
    try {
        const boardId = req.params.id
        const msg = {
            txt: req.body.txt,
        }
        const savedMsg = await boardService.addboardMsg(boardId, msg)
        res.json(savedMsg)
    } catch (err) {
        logger.error('Failed to add board msg', err)
        res.status(400).send({ err: 'Failed to add board msg' })
    }
}

export async function removeBoardMsg(req, res) {
    try {
        const { id: boardId, msgId } = req.params

        const removedId = await boardService.removeboardMsg(boardId, msgId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove board msg', err)
        res.status(400).send({ err: 'Failed to remove board msg' })
    }
}
