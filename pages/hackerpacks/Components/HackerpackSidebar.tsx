import React from 'react';
import { useUser } from '../../../lib/profile/user-data';
import { useAuthContext } from '../../../lib/user/AuthContext';

/**
 * Sidebar for the hackerpack; this is hidden on mobile
 */
export default function HackerpackSidebar({ content }: { content: SidebarSection[] }) {
  const { isSignedIn } = useAuthContext();
  const user = useUser();
  const role = user.permissions?.length > 0 ? user.permissions[0] : '';
  return (
    <>
      {/* ghost section to fill in for fixed sidebar */}
      <section
        id="ghost"
        className="hidden md:flex justify-center h-screen sticky top-0 md:w-1/6 2xl:w-1/8 text-xs md:text-xs lg:text-sm overflow-auto"
      ></section>

      <section
        id="Sidebar"
        className="hidden md:flex flex-col justify-start h-screen fixed top-16 border-r-2 border-gray-600 w-1/4 md:w-1/6 2xl:w-1/8 text-xs md:text-xs lg:text-sm text-white"
      >
        <section id="options" className="relative px-6 py-4 h-[85vh] overflow-auto">
          <div className="font-bold mb-3">HackerPack</div>
          <ul className="pb-32">
            {/* Maps the sidebar-content.json file to a nested list */}
            {content.map((mainSection) => (
              <li key={mainSection.title}>
                <a
                  className="bold text-white hover:text-blue-100 transition-all"
                  href={mainSection.href}
                >
                  {mainSection.title}
                </a>
                {mainSection.sections ? (
                  <ul className="pl-4">
                    {mainSection.sections.map((subsection) => (
                      <li key={subsection.title}>
                        <a
                          href={subsection.href || '#'}
                          className="text-gray-400 hover:text-white transition-all"
                        >
                          {subsection.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
        {/* User greeting for bottom of sidebar */}
        <div className="bottom-0 w-full border-t-2 border-gray-600 text-center py-3 bg-transparent text-white bg-black bg-opacity-75">
          <div>
            Welcome,{' '}
            {!user || !isSignedIn ? 'hacker' : user.firstName !== '' ? user.firstName : 'hacker'}
          </div>
          <div className="text-indigo-500">{role}</div>
        </div>
      </section>
    </>
  );
}
