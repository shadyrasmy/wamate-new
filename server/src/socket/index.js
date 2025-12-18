module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('🔌 New client connected:', socket.id);

        // Join instance room to listen for events (QR, messages)
        socket.on('join_instance', (instanceId) => {
            console.log(`Client ${socket.id} joining instance room: ${instanceId}`);
            socket.join(instanceId);
        });

        socket.on('leave_instance', (instanceId) => {
            socket.leave(instanceId);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};
