import { UserData } from '../pages/api/users';

interface UserListProps {
  hasSuperAdminPrivilege: boolean;
  users: UserData[];
  onItemClick: (id: string) => void;
}

export default function UserList({ users, onItemClick, hasSuperAdminPrivilege }: UserListProps) {
  return (
    <div className="w-full flex flex-row flex-wrap">
      {users.map((user, idx) => (
        <div
          key={idx}
          className={`2xl:w-1/5 lg:w-1/4 md:w-1/3 w-full text-center flex flex-row items-center gap-x-4 my-2 p-2 rounded-lg ${
            hasSuperAdminPrivilege ? 'cursor-pointer hover:bg-gray-600' : ''
          }`}
          onClick={() => {
            if (hasSuperAdminPrivilege) onItemClick(user.id);
          }}
        >
          <svg height="28" width="28">
            <circle cx="14" cy="14" r="10" fill="#9e73d2" />
          </svg>
          <h1 className="font-bold">{`${user.user.firstName} ${user.user.lastName}`}</h1>
        </div>
      ))}
    </div>
  );
}
