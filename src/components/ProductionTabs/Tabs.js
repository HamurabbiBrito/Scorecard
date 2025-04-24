'use client';
import { useState } from 'react';
import { formsConfig } from './formConfig';

export default function ProductionTabs({ area }) {
  const [activeTab, setActiveTab] = useState(formsConfig[0].id);

  return (
    <div>
      <div className="flex border-b overflow-x-auto">
        {formsConfig.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-b-2 border-blue-500 font-bold' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {formsConfig.find(tab => tab.id === activeTab)?.form(area)}
      </div>
    </div>
  );
}