import { createCustomEqual } from "fast-equals";
import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from "react";

const deepCompareEqualsForMaps = createCustomEqual(
    (deepEqual) => (a, b) => {
        if (a instanceof google.maps.LatLng || b instanceof google.maps.LatLng) {
            return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
        }

        return deepEqual(a, b);
    }
);


const useDeepCompareMemoize = (value) => {
    const ref = useRef();

    if (!deepCompareEqualsForMaps(value, ref.current)) {
        ref.current = value;
    }

    return ref.current;
};

const useDeepCompareEffectForMaps = (callback, dependencies) => {
    useEffect(callback, dependencies.map(useDeepCompareMemoize));
};

export const Marker = (options) => {
    const [marker, setMarker] = useState();

    useEffect(() => {
        if (!marker) {
            setMarker(new google.maps.Marker());
        }

        return () => {
            if (marker) {
                marker.setMap(null);
            }
        };
    }, [marker]);

    useEffect(() => {
        if (marker) {
            marker.setOptions(options);
        }
    }, [marker, options]);

    return null;
};

export const Map = ({ children, onClick, ...options }) => {
    const ref = useRef(null);
    const [map, setMap] = useState();

    useEffect(() => {
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, {}));
        }
    }, [ref, map]);

    useDeepCompareEffectForMaps(() => {
        if (map) {
            map.setOptions(options);
        }
    }, [map, options]);

    useEffect(() => {
        if (map) {
            ['click'].forEach((eventName) =>
                google.maps.event.clearListeners(map, eventName)
            );

            if (onClick) {
                map.addListener('click', onClick);
            }
        }
    }, [map, onClick]);

    return (
        <>
            <div ref={ref} style={{ flexGrow: '1', height: '100%' }} />

            {Children.map(children, (child) => {
                if (isValidElement(child)) {
                    return cloneElement(child, { map });
                }
            })}
        </>
    );
};