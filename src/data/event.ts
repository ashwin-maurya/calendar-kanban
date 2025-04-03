import { EventsByDate } from "../lib/types";

const eventsData: EventsByDate = {
  "2025-03-31": [
    {
      id: "event-1",
      title: "Coffee with Alex",
      description:
        "Meet with Alex to brainstorm ideas for the upcoming product launch. ",
      imageUrl: "https://loremflickr.com/200/200?random=1",
      time: "09:00 AM",
    },
    {
      id: "event-2",
      title: "Team Standup",
      description: "Weekly standup meeting with the dev team.",
      imageUrl: "https://loremflickr.com/200/200?random=2",
      time: "02:00 PM",
    },
  ],
  "2025-04-01": [
    {
      id: "event-3",
      title: "Yoga Session",
      description: "Join for a relaxing yoga session.",
      imageUrl: "https://loremflickr.com/200/200?random=3",
      time: "12:00 PM",
    },
    {
      id: "event-4",
      title: "Product Demo",
      description: "Demo of UI improvements.",
      imageUrl: "https://loremflickr.com/200/200?random=4",
      time: "03:30 PM",
    },
  ],
  "2025-04-02": [
    {
      id: "event-5",
      title: "Client Meeting",
      description: "Review project progress with the client.",
      imageUrl: "https://loremflickr.com/200/200?random=5",
      time: "11:30 AM",
    },
  ],
};

export default eventsData;
