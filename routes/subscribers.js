const express = require('express')
const router = express.Router()
const Subscriber = require('../models/subscriber')

// Getting all subscribers
router.get('/', async (req, res) => {
    try {
        const subscribers = await Subscriber.find()
        res.json(subscribers)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


// Getting one subscriber
router.get('/:id', getSubscriber, (req, res) => {
    res.send(res.subscriber)
})


// Creating one subscriber
router.post('/',async  (req, res) => {
    const subscriber = new Subscriber({
        name: req.body.name,
        subscribedToChannel: req.body.subscribedToChannel
    })

    try {
        const newSubscriber = await subscriber.save()
        res.status(201).json({ message: 'New Subscriber added', data: newSubscriber})
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})



// Updating one subscriber
   // The reason we use patch and not put is because patch only updates the information of only one record while put does so for all the records
router.patch('/:id', getSubscriber, async (req, res) => {
    if(req.body.name !== null) {
        res.subscriber.name = req.body.name
    } 
    if(req.body.subscribedToChannel !== null){
        res.subscriber.subscribedToChannel = req.body.subscribedToChannel
    }

    try {
        const updatedSubscriber = await res.subscriber.save()
        res.json(updatedSubscriber)
    } catch (error) {
        res.status(400).json({ message: error.message})   
    }
   
})



// Deleting one subscriber
router.delete('/:id', getSubscriber, async (req, res) => {
    try {
      await  res.subscriber.remove()
      res.json({ message: 'Deleted Subscriber'})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

async function getSubscriber(req, res, next) {
    let subscriber
    try {
        subscriber = await Subscriber.findById(req.params.id)
        if(subscriber == null){
           return res.status(404).json({ message: 'Cannot find user'})
        }
    } catch(error) {
       return res.status(500).json({ message: error.message})
    }
    
    res.subscriber = subscriber
    next()
}


module.exports = router