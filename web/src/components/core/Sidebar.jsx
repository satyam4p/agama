/*
 * Copyright (c) [2022] SUSE LLC
 *
 * All Rights Reserved.
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of version 2 of the GNU General Public License as published
 * by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, contact SUSE LLC.
 *
 * To contact SUSE LLC about this file by physical or electronic mail, you may
 * find current contact information at www.suse.com.
 */

import React, { useEffect, useRef, useState } from "react";
import { Icon, PageActions } from "~/components/layout";
import { About, Disclosure, LogsButton, ShowLogButton, ShowTerminalButton } from "~/components/core";
import { ChangeProductLink } from "~/components/software";
import { TargetIpsPopup } from "~/components/network";

/**
 * Internal and memoized component for rendering links only once
 *
 * The reason of this is to avoid re-rendering those links each time
 * the sidebar visibility is changed. It does not make sense to re-trigger
 * their logic (which might be complicated or not) just because the
 * "expanded"/"visible" state of the Sidebar has changed.
 *
 * The issue can be fixed in other ways, but there is a reason for discarded
 * them at this moment. Namely,
 *
 *   - Use a stateless Sidebar, handling the visibility with pure CSS
 *
 *     That would be great, but it's (almost?) not possible to make it
 *     completely accessible using just CSS.
 *
 *   - Move these children outside, placing them in the same location the
 *     <Sidebar /> is used.
 *
 *     It will not work when using the function as child component pattern,
 *     which is the case of the PageOptions content, which we will use for
 *     teleporting a Page options to the Sidebar by now.
 *
 * To know more about how children and parent re-renders behavior, have a look to
 * https://www.developerway.com/posts/react-elements-children-parents
 */
const FixedLinks = React.memo(() => (
  <>
    <ChangeProductLink />
    <Disclosure label="Diagnosis tools" data-keep-sidebar-open>
      <ShowLogButton />
      <LogsButton data-keep-sidebar-open="true" />
      <ShowTerminalButton />
    </Disclosure>
    <TargetIpsPopup />
    <About />
  </>
), () => true);

/**
 * D-Installer sidebar navigation
 */
export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef(null);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) closeButtonRef.current.focus();
  }, [isOpen]);

  /**
   * Handler for automatically closing the sidebar when a click bubbles from a
   * children of its content.
   *
   * @param {MouseEvent} event - the event triggered by a click
   */
  const onClick = (event) => {
    const { target, currentTarget } = event;
    if (target === currentTarget) return;
    if (!target.dataset.keepSidebarOpen) close();
  };

  return (
    <>
      <PageActions>
        <button
          onClick={open}
          className="plain-control"
          aria-label="Show navigation and other options"
          aria-controls="navigation-and-options"
          aria-expanded={isOpen}
        >
          <Icon name="menu" />
        </button>
      </PageActions>

      <nav
        id="navigation-and-options"
        className="wrapper sidebar"
        aria-label="Navigation and other options"
        data-state={isOpen ? "visible" : "hidden"}
      >
        <header className="split justify-between">
          <h1>Options</h1>

          <button
            onClick={close}
            ref={closeButtonRef}
            className="plain-control"
            aria-label="Hide navigation and other options"
          >
            <Icon name="menu_open" data-variant="flip-X" onClick={close} />
          </button>
        </header>

        <div className="flex-stack" onClick={onClick}>
          <FixedLinks />
        </div>

        <footer className="split" data-state="reversed">
          <a onClick={close}>
            Close <Icon size="16" name="menu_open" data-variant="flip-X" />
          </a>
        </footer>
      </nav>
    </>
  );
}
