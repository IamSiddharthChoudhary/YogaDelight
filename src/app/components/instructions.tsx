import type React from "react";
import { poseInstructions } from "../utils/data";

interface InstructionsProps {
  currentPose: string;
}

const Instructions: React.FC<InstructionsProps> = ({ currentPose }) => {
  return (
    <div className="bg-gray-700 rounded-xl p-4">
      <h3 className="text-xl font-semibold mb-3 text-indigo-200">
        Instructions
      </h3>
      <ul className="space-y-2">
        {poseInstructions[currentPose]?.map((instruction, index) => (
          <li key={index} className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-500 text-white text-sm mr-3 flex-shrink-0">
              {index + 1}
            </span>
            <span className="text-gray-100">{instruction}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Instructions;
