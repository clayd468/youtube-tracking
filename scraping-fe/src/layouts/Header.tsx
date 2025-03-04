import LogoutIcon from '@/assets/icons/logout-icon.svg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { randomNumber } from '../lib/utils';

export const Header = () => {
  const { logout } = useAuth();

  return (
    <header className="shadow-scrapMedia sticky flex bg-white top-0 z-[100] h-[72px]">
      <div className="container mx-auto flex items-center">
        <div className="ml-auto flex items-center gap-4 align-middle">
          <Avatar>
            <AvatarImage
              src={`https://avatar.iran.liara.run/public/${randomNumber(
                1,
                100
              )}`}
              alt="@liara"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Button size="icon" variant="ghost" onClick={logout}>
            <img src={LogoutIcon} alt="logout" className="w-7" />
          </Button>
        </div>
      </div>
    </header>
  );
};
