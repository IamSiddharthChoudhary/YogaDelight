"use client";
import type React from "react";
import { useState } from "react";
import { poseImages } from "../../public/pose_images";
import { ChevronDown } from "lucide-react";

interface DropDownProps {
  poseList: string[];
  currentPose: string;
  setCurrentPose: (pose: string) => void;
}

const DropDown: React.FC<DropDownProps> = ({
  poseList,
  currentPose,
  setCurrentPose,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <button
        className="flex items-center justify-between w-full p-4 bg-gray-700 rounded-xl text-white hover:bg-gray-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {poseImages[currentPose] && (
            <img
              src={poseImages[currentPose] || "/placeholder.svg"}
              className="h-10 w-10 object-cover rounded-md"
              alt={`${currentPose} icon`}
            />
          )}
          <span className="text-lg font-medium">{currentPose}</span>
        </div>
        <ChevronDown
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <ul className="absolute z-10 w-full mt-2 bg-gray-700 rounded-xl overflow-hidden shadow-lg max-h-80 overflow-y-auto">
          {poseList.map((pose, index) => (
            <li
              key={index}
              onClick={() => {
                setCurrentPose(pose);
                setIsOpen(false);
              }}
              className="hover:bg-gray-600 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3 p-4">
                {poseImages[pose] && (
                  <img
                    src={poseImages[pose] || "/placeholder.svg"}
                    className="h-10 w-10 object-cover rounded-md"
                    alt={`${pose} icon`}
                  />
                )}
                <span className="text-lg font-medium">{pose}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropDown;
