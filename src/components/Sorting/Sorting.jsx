import React from 'react';
import filter from "../../assets/icons/filter.svg"

const Sorting = ({ text }) => {
    return (
        <div className="flex w-full justify-between items-center">
            <div className='p-1 flex gap-1'>
                <img src={filter} alt='sorting' />
                <p className='text-paragraph-1'>{text}</p>
            </div>

            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.52861 3.52861C5.78896 3.26826 6.21107 3.26826 6.47141 3.52861L10.4714 7.52861C10.7318 7.78896 10.7318 8.21107 10.4714 8.47141L6.47141 12.4714C6.21107 12.7318 5.78896 12.7318 5.52861 12.4714C5.26826 12.2111 5.26826 11.789 5.52861 11.5286L9.0572 8.00001L5.52861 4.47141C5.26826 4.21107 5.26826 3.78896 5.52861 3.52861Z" fill="#4B5563" />
            </svg>

        </div>
    );
};

export default Sorting;