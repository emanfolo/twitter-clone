import express from "express";
import { PrismaClient } from "@prisma/client";
import cors  from 'cors'
import * as dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config({path: '../.env'})

const prisma = new PrismaClient()

const allowedOrigins = ['http://localhost:3000']

const options: cors.CorsOptions = {
  origin: allowedOrigins
}

const router = express.Router()
router.use(express.json())
router.use(cors(options))

const authenticateToken = (req: any, res:any, next:any) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null ) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

router.post('/new', authenticateToken, async (req: any, res:any) => {

  const newRetweet = await prisma.retweet.create({
    data: {
      userID: req.user.id,
      tweetID: req.body.tweetID,
    }
  })

  if (req.user.id != req.body.notificationRecipient){
    const addNotification = await prisma.notification.create({
    data: {
      retweetID: newRetweet.id,
      type: 'Retweet',
      recipientID: req.body.notificationRecipient
    }
    })
  }  
  
  res.sendStatus(204)
})

router.post('/delete', authenticateToken, async (req: any, res:any) => {

  const retweet = await prisma.retweet.findUnique({
    where: {
      TweetRetweetUserID: {
        userID: req.user.id , 
        tweetID: req.body.tweetID 
      }
    }, 
      select: {
        id: true
      }
    })


  if (retweet){

    if (req.user.id != req.body.notificationRecipient){
      const deleteNotification = await prisma.retweet.update({
        where: {
          id: retweet.id
        },
        data: {
          notification: {
            delete: true,
          }
        }
      })
    }
    
    
    const deletedRetweet = await prisma.retweet.delete({
    where: {
      id: retweet.id
    }
  })

  res.sendStatus(204)
  
  } else {
    res.send('There has been an error, please try again')
    res.sendStatus(404)
  }
  
})

export default router