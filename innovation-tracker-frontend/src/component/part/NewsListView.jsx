import React from 'react'

function NewsListView() {
  return (
    <div>
        <div className='row gap-3'>
            <div className='card rounded-0 border border-danger border-4'>    
                <div className='card-body d-flex align-items-center justify-content-center ms-4' style={{width:'350px', height:'50px'}}>
                    <h4 className='card-title text-center' style={{textAlign:'center'}}>News List</h4>
                </div>
            </div>
            <div className='card rounded-0 border border-danger border-4'>
                <div className='card-body' style={{height:'350px'}}>

                </div>
            </div>
        </div>
    </div>
  )
}

export default NewsListView