// sdn/routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Thêm dòng này ở đầu file

const Employee = require('../models/employees');

// Lấy tất cả nhân viên
router.get('/', async (req, res) => {
    try {
        // Kiểm tra kết nối trước khi query
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Database not connected');
        }

        const employees = await Employee.find();
        console.log('Employees:', employees);
        
        if (!employees || employees.length === 0) {
            return res.status(404).json({
                message: "No employees found"
            });
        }

        res.status(200).json({
            message: "Get employees successfully",
            data: employees,
        });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});




router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        
        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json({
            message: "Get detail employee successfully",
            data: employee
        });
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        
        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json({
            message: "Delete employee successfully",
            data: employee
        });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
