import { runSeed } from "./seeds.js";
import { User } from "../../../api/v1/modules/users/models/user.model.js";
const users = [
  { name: "Sachin Shakya", email: "sachin.shakya@example.com", role: "admin" },
  { name: "Aarav Patel", email: "aarav.patel@example.com", role: "user" },
  { name: "Priya Mehta", email: "priya.mehta@example.com", role: "user" },
  { name: "Rohit Verma", email: "rohit.verma@example.com", role: "user" },
  { name: "Neha Sharma", email: "neha.sharma@example.com", role: "admin" },
  { name: "Karan Singh", email: "karan.singh@example.com", role: "user" },
  { name: "Simran Kaur", email: "simran.kaur@example.com", role: "user" },
  { name: "Aditya Rao", email: "aditya.rao@example.com", role: "user" },
  { name: "Ritika Jain", email: "ritika.jain@example.com", role: "admin" },
  { name: "Manish Kumar", email: "manish.kumar@example.com", role: "user" },
];

// You can seed multiple models if needed
runSeed([{ model: User, data: users, name: "Users", reset: true }]);
