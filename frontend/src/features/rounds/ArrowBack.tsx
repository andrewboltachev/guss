import type { SVGProps } from "react"

const ArrowBack = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} {...props}>
    <path d="m13.707 4.707-1.414-1.414L3.586 12l8.707 8.707 1.414-1.414L6.414 12l7.293-7.293z" fill="currentColor" />
    <path d="m19.707 4.707-1.414-1.414L9.586 12l8.707 8.707 1.414-1.414L12.414 12l7.293-7.293z" fill="currentColor" />
  </svg>
);
export default ArrowBack;
