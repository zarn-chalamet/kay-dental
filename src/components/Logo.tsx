interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8',      // 32px
  md: 'w-10 h-10',    // 40px
  lg: 'w-12 h-12',    // 48px
  xl: 'w-20 h-20',    // 80px
};

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  return (
    <img 
      src="/logo.png" 
      alt="KAY Dental Care" 
      className={`${sizeMap[size]} object-contain ${className}`}
      width={80}
      height={80}
    />
  );
}