import { useState } from 'react'
import './Term.css'

function Term(){

    return(
        <>
        <div className="bg-container">
            <div className="glass-layer">
                <div className="top-bar">
                    <h1 className='termandcondition'>
                        Terms and
                        <br />conditions.
                    </h1>
                    <div className="line-landscape"></div>
                </div>
                <div className='detail-notes'>
                    <h2 className='date'>Date
                    <br />June 20, 2023
                    </h2>
                    <div className='line-potrait'></div>
                    <div className='term-container'>
                        <p className='scroll-term'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose</p>
                    </div>
                </div>
            </div>
        </div>
        </>
    )

}

export default Term