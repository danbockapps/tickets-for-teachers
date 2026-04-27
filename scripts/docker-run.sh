  docker run -d \
    -p 3000:3000 \
    -v /var/lib/tickets-for-teachers:/app/data \
    --env-file /home/dan/projects/tickets-for-teachers/.env.production \
    --name tickets-for-teachers \
    tickets-for-teachers