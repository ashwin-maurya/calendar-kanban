import { EventsByDate } from "../lib/types";

const eventsData: EventsByDate = {
  "2025-03-31": [
    {
      id: "event-1",
      title: "Coffee with Alex",
      description:
        "Meet with Alex to brainstorm ideas for the upcoming product launch.",
      imageUrl: "https://fastly.picsum.photos/id/312/1920/1080.jpg",
      time: "09:00 AM",
    },
    {
      id: "event-2",
      title: "Team Standup",
      description: "Weekly standup meeting with the dev team.",
      imageUrl: "https://fastly.picsum.photos/id/737/1920/1080.jpg",
      time: "02:00 PM",
    },
  ],
  "2025-04-01": [
    {
      id: "event-3",
      title: "Yoga Session",
      description: "Join for a relaxing yoga session.",
      imageUrl: "https://fastly.picsum.photos/id/392/1920/1080.jpg",
      time: "12:00 PM",
    },
    {
      id: "event-4",
      title: "Product Demo",
      description: "Demo of UI improvements.",
      imageUrl: "https://fastly.picsum.photos/id/249/1920/1080.jpg",
      time: "03:30 PM",
    },
  ],
  "2025-04-02": [
    {
      id: "event-5",
      title: "Client Meeting",
      description: "Review project progress with the client.",
      imageUrl: "https://fastly.picsum.photos/id/908/1920/1080.jpg",
      time: "11:30 AM",
    },
  ],
};

export default eventsData;
