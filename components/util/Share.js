import {Button, Loading} from "@nextui-org/react";
import {useRouter} from "next/router";
import {Share2Icon} from "@radix-ui/react-icons";
import {useEffect, useState} from "react";


/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function Share() {
    const router = useRouter();
    

    //<Button light color="primary" auto onPress={() => {
    //             if (navigator.share) {
    //                 navigator.share({
    //                     title: `${document.title}`,
    //                     text: 'Check out this Looped page!',
    //                     url: `${window.location.href}`,
    //                 })
    //             }
    //         }}>
    //             <Share2Icon/>
    //         </Button>
    return (
        <Button
            light
            onClick={() => {
                        navigator.share({
                            title: `${document.title}`,
                            text: 'Check out this paged on Looped',
                            url: `${window.location.href}`,
                        })
                    .then(() => console.log('Successful share'))
                    .catch((error) => console.log('Error sharing', error));
            }}
            > <Share2Icon/>
        </Button>
    )
}
