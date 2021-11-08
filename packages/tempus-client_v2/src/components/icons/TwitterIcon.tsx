import { FC } from 'react';
import IconProps from './IconProps';

const TwitterIcon: FC<IconProps> = props => {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.7024 2.11415C19.0066 2.42248 18.2591 2.63082 17.4733 2.72498C18.2841 2.23981 18.8907 1.4762 19.1799 0.576649C18.4181 1.02914 17.5844 1.34765 16.7149 1.51832C16.1302 0.894037 15.3558 0.480255 14.5119 0.341211C13.6679 0.202168 12.8017 0.345642 12.0476 0.74936C11.2936 1.15308 10.6939 1.79445 10.3417 2.5739C9.98954 3.35335 9.90454 4.22727 10.0999 5.05998C8.55633 4.98248 7.04628 4.58127 5.66778 3.8824C4.28928 3.18353 3.07313 2.20262 2.09826 1.00332C1.76493 1.57832 1.57326 2.24498 1.57326 2.95498C1.57289 3.59415 1.73029 4.22352 2.03149 4.78726C2.3327 5.351 2.7684 5.83168 3.29993 6.18665C2.68349 6.16704 2.08066 6.00047 1.5416 5.70082V5.75082C1.54153 6.64727 1.85162 7.51613 2.41925 8.20998C2.98687 8.90383 3.77707 9.37992 4.65576 9.55748C4.08391 9.71225 3.48438 9.73504 2.90243 9.62415C3.15034 10.3955 3.63326 11.07 4.28357 11.5533C4.93388 12.0365 5.71903 12.3043 6.5291 12.3192C5.15396 13.3987 3.45567 13.9842 1.70743 13.9816C1.39775 13.9817 1.08833 13.9636 0.780762 13.9275C2.55533 15.0685 4.62105 15.674 6.73076 15.6716C13.8724 15.6716 17.7766 9.75665 17.7766 4.62665C17.7766 4.45998 17.7724 4.29165 17.7649 4.12498C18.5243 3.57579 19.1799 2.89573 19.7008 2.11665L19.7024 2.11415Z"
        fill="black"
      />
    </svg>
  );
};
export default TwitterIcon;