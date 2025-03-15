import React from 'react'

function NewsListView() {
  return (
    <div>
        <div className='row gap-3'>
            <div className='card rounded-0 border border-danger border-4'>    
                <div className='card-body' style={{width:'200px', height:'50px'}}>
                    <h4 className='card-title text-center'>News List</h4>
                </div>
            </div>
            <div className='card rounded-0 border border-danger border-4'>
                <div className='card-body'>
                </div>
            </div>
        </div>
    </div>
  )
}

export default NewsListView