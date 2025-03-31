import ActuatorCard from "../cards/sensor-card";

const Dashboard = () => {
  // const [selectedRoom, setSelectedRoom] = useState<
  //   "Home" | "Living Room" | "Bedroom"
  // >("Home");

  // const aircons = getAircons();
  // const lights = getLights();

  return (
    <div className="flex flex-1 ml-10 my-6 mr-6 ">
      <div className="flex flex-col gap-3 flex-1 w-full h-full rounded-3xl">
        {/* TOP ROW */}
        {/* <div className="flex gap-3 h-[60%]">
          <HomeManagementCard
            currentPage="home"
            username={
              user ? `${user.first_name} ${user.last_name}` : "John Doe"
            }
            backgroundImage="https://christophorus.porsche.com/.imaging/mte/porsche-templating-theme/image_1080x624/dam/Christophorus-Website/C412/Zusatzgalerien-und-Thumbnails/Garage/24_06_03_Christophorus_TheNordicBarnProject-0110.jpg/jcr:content/24_06_03_Christophorus_TheNordicBarnProject-0110.jpg"
            livingRoomImage="https://images.unsplash.com/photo-1616940844649-535215ae4eb1?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            bedroomImage="https://images.unsplash.com/photo-1727706572437-4fcda0cbd66f?q=80&w=2371&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            onTabChange={(tab) => setSelectedRoom(tab)}
          />
          <DeviceCard
            airConditionersCount={
              (selectedRoom === "Home"
                ? [
                    ...(aircons["Living Room"] || []),
                    ...(aircons["Bedroom"] || []),
                  ]
                : aircons[selectedRoom as "Living Room" | "Bedroom"] || []
              ).filter((device) => device).length || 0
            }
            lightsCount={
              (selectedRoom === "Home"
                ? [
                    ...(lights["Living Room"] || []),
                    ...(lights["Bedroom"] || []),
                  ]
                : lights[selectedRoom as "Living Room" | "Bedroom"] || []
              ).filter((device) => device).length || 0
            }
            selectedRoom={selectedRoom}
            aircons={aircons}
            lights={lights}
          />
        </div> */}

        {/* BOTTOM ROW */}
        <div className="flex gap-3 h-[40%]">
          <ActuatorCard
            title="Water Pump"
            description="My Water Pump"
            backgroundImage="https://tomahawk-power.com/cdn/shop/articles/wide_angle_1024x.jpg?v=1623716961"
            isActive={true}
          />
          <ActuatorCard
            title="Fan"
            description="My Fan"
            backgroundImage="https://m.media-amazon.com/images/I/810r2WWqGoL._AC_UF894,1000_QL80_.jpg"
            isActive={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
