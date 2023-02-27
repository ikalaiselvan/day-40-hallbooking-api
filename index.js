import * as dotenv from "dotenv";
dotenv.config();
import express from "express";


const app = express();

const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());

const rooms = [
  {
    id: 1,
    name: "Hall 1",
    totalSeats: 135,
    availableSeats: 135,
    amenities: ["Full A/c", "Free Parking", "Wifi", "Security Cameras"],
    pricePerHourInRupees: 200,
  },
  {
    id: 2,
    name: "Hall 2",
    totalSeats: 155,
    availableSeats: 155,
    amenities: ["Full A/c", "Free Parking", "Wifi", "Security Cameras"],
    pricePerHourInRupees: 500,
  },
];

const BookedRooms = [
  {
    id: 1,
    name: "Person 1",
    roomId: 1,
    seatNo: 2,
    status: "booked",
    date: "02 sep 2021",
    startTime: "5:00:00",
    endTime: "8:00:00",
  },
  {
    id: 2,
    name: "Person 2",
    roomId: 2,
    seatNo: 2,
    status: "booked",
    date: "04 sep 2021",
    startTime: "16:00:00",
    endTime: "20:00:00",
  },
  {
    id: 3,
    name: "Person 3",
    roomId: 1,
    seatNo: 1,
    status: "booked",
    date: "02 sep 2021",
    startTime: "5:00:00",
    endTime: "8:00:00",
  },
];

//Create Room
app.post("/create-room", (req, res) => {
    try {
        const obj = {
            id: rooms.length + 1,
            ...req.body
        }
        rooms.push(obj);
        console.log(rooms);
        res.json({
            message: "Room created!"
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

//Book a room
app.post('/book-room', (req, res) => {
    try {
        //Booking details from request
        const bookingdata = req.body.seatNo;
        const BookedDateStartTime = new Date(`${req.body.date} ${req.body.startTime}`);
        //Check already Booked
        const alreadyBooked = BookedRooms.some(detail => {
            const detailDateStartTime = new Date(`${detail.date} ${detail.startTime}`);
            const detailDateEndTime = new Date(`${detail.date} ${detail.endTime}`);
            if (detail.seatNo === bookingdata && BookedDateStartTime >= detailDateStartTime && BookedDateStartTime <= detailDateEndTime) {
                return true;
            }
        })

        if (alreadyBooked) {
            res.json({
                message: "Room not available for that date and time!"
            })
        } else {
            BookedRooms.push({
                bookedStatus: true,
                ...req.body
            })
            res.json({
                message: "Room booked!"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})


//List all rooms

app.get('/list_rooms', (req, res) => {
    try {
        res.send(rooms);
    } catch (error) {
        res.status(500).json({
            message: "Internal server error!"
        })
    }
})

//List all customers
app.get('/customers', (req, res) => {
    try {
        // const data = BookedRooms.map(room => {
        //     const roomIndex = rooms.findIndex(obj => obj.id === room.seatNo)
        //     return {
        //         customerName: room.name,
        //         roomName: rooms[roomIndex].name,
        //         date: room.date,
        //         startTime: room.startTime,
        //         endTime: room.endTime
        //     }
        // })
        res.send(BookedRooms);
    } catch (error) {
        res.status(500).json({
            message: "Internal server error!"
        })
    }
})


app.get("/",(req, res)=>{
    res.send({
      create_room: "/create-room",
      book_room: "/book-room",
      list_rooms: "/list_rooms",
      list_costomers: "/customers",
    });
})

app.listen(PORT, ()=> console.log(`App is running on port ${PORT}`))