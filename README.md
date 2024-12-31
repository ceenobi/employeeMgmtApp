# Employee Management System

## Overview

The Employee Management System is a web application designed to streamline the management of employees, tasks, events, and payroll within an organization. This application provides real-time notifications and a user-friendly interface to enhance productivity and collaboration.

## Features

- **User Authentication**: Secure login and registration for users.
- **Employee Management**: Add, update, and delete employee records.
- **Task Management**: Create, assign, and track tasks with due dates and statuses.
- **Event Management**: Schedule and manage events with notifications.
- **Payroll Management**: Generate and manage payroll for employees.
- **Real-Time Notifications**: Receive instant notifications for new tasks, events, and payroll updates using Pusher.
- **Dashboard**: A comprehensive dashboard displaying key metrics and recent activities.
- **Responsive Design**: Mobile-friendly layout for accessibility on various devices.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, DaisyUI
- **Backend**: Node.js, Express, MongoDB
- **Real-Time Communication**: Pusher
- **Date Manipulation**: Day.js
- **Form Handling**: React Hook Form

## Installation

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB (local or cloud instance)
- Pusher account (for real-time notifications)

### Clone the Repository

### keys
MONGODB_URI=<your_mongodb_connection_string>
VITE_PUSHER_APP_KEY=<your_pusher_app_key>
VITE_PUSHER_APP_CLUSTER=<your_pusher_app_cluster>
EMAIL=<your_email>
PASSWORD=<your_googleAppPassword>

```bash
git clone https://github.com/ceenobi/employmgmt.git
cd employmgmt

