import DayNightSwitch from "@/components/shsfui/switch/day-night-switch";
import {UserButton} from "@clerk/nextjs";

export default function Home() {
  return (
      <div>
        <UserButton/>
          <DayNightSwitch/>
      </div>
  );
}
