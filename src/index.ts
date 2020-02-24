import ScrollBooster, { ScrollBoosterOptions, ScrollingState } from 'scrollbooster';
import { useCallback, useRef, useState } from 'react';

export interface ScrollBoosterHook<T> extends Omit<ScrollBoosterOptions, 'viewport' | 'onUpdate' | 'content'> {
    onUpdate?: (state: ScrollingState, node: T) => void;
}

/**
 * Returns ref values for the viewport, the content and the scrollbooster instance
 */
export default <T extends Element>(options: ScrollBoosterHook<T> = {}) => {
    const content = useRef<T | null>(null);
    const [scrollBooster, setScrollBooster] = useState<ScrollBooster | null>(null);
    const viewport = useCallback(
        (node: T | null) => {
            if (scrollBooster) {
                // clear the scrollbooster eventListeners.
                scrollBooster.destroy();
            }
            if (node && !scrollBooster) {
                const { onUpdate, ...rest } = options;
                setScrollBooster(
                    new ScrollBooster({
                        viewport: node,
                        content: content.current ?? node,
                        onUpdate: state => onUpdate?.(state, node),
                        ...rest,
                    })
                );
            }
        },
        [scrollBooster, options]
    );

    return [viewport, content, scrollBooster] as const;
};
