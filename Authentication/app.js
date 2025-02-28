require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const Authrouter = require('./routes/Authrouter');
const dashboardroutes = require('./routes/dashboardroutes');
const teamRoutes = require("./routes/teamRoutes");
const adminroutes = require("./routes/adminroutes");

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = ['http://localhost:5173', 'https://team-sync-09eeee.vercel.app/'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


mongoose.connect(process.env.MONGOOSE_CONNECTION,)
    .then(() => console.log("Users database connected successfully"))
    .catch((err) => console.error(" MongoDB Connection Error:", err));


app.use('/auth', Authrouter);
app.use('/dashboard', dashboardroutes);
app.use("/api", teamRoutes);
app.use("/admin", adminroutes);


app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
