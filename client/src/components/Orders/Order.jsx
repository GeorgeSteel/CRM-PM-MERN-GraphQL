import React from 'react';

import { GET_PRODUCT_QUERY } from '../../queries/Products';
import { UPDATE_STATUS_MUTATION } from '../../queries/Orders';
import { Query } from 'react-apollo';
import { Mutation } from 'react-apollo';

import Loader from '../Layout/Loader';
import SummaryProduct from './SummaryProduct';

const Order = ({ order: { id, order, date, total, status }, client }) => {
    const translatedDate = new Date(Number(date));

    let styles;

    if (status === 'PENDIENTE') {
        styles = 'border-light'; 
    } else if (status === 'CANCELADO') {
        styles = 'border-danger';
    } else {
        styles = 'border-success';
    }
    return (
        <div className="col-md-4">
            <div className={`card mb-3 ${styles}`} >
                <div className="card-body">
                    <p className="card-text font-weight-bold ">Estado:
                        <Mutation mutation={ UPDATE_STATUS_MUTATION }>
                        { updateStatus => (
                        <select 
                                className="form-control my-3"
                                value={ status }
                                onChange={ e => {
                                    const input = {
                                        id,
                                        order,
                                        date,
                                        total,
                                        status: e.target.value,
                                        client
                                    };
                                    console.log(input);
                                    updateStatus({
                                        variables: { input }
                                    });
                                } }
                                >
                                    <option value="PENDIENTE">PENDIENTE</option>
                                    <option value="COMPLETADO">COMPLETADO</option>
                                    <option value="CANCELADO">CANCELADO</option>
                            </select>
                            ) }
                        </Mutation>
                    </p> 
                    <p className="card-text font-weight-bold">Pedido ID:
                        <span className="font-weight-normal"> { id }</span>
                    </p> 
                    <p className="card-text font-weight-bold">Fecha Pedido: 
                        <span className="font-weight-normal"> { translatedDate.toLocaleString("es-MX") }</span>
                    </p>
                    <p className="card-text font-weight-bold">Total: 
                        <span className="font-weight-normal"> ${ total }</span>
                    </p>

                    <h3 className="card-text text-center mb-3">Artículos del pedido</h3>
                    { order.map((product, idx) => {
                        const { id, quantity } = product;

                        return(
                            <Query key={ idx } query={ GET_PRODUCT_QUERY } variables={{ id }}>
                                {({ loading, error, data }) => {
                                    if(loading) return <Loader/>;
                                    if(error) return `Error ${error.message}`;

                                    return(
                                        <SummaryProduct
                                            product={ data.getProduct }
                                            quantity={ quantity }
                                            key={ id }
                                        />
                                    );
                                }}
                            </Query>
                        );
                    }) }
                </div>
            </div>
        </div>
    );
};

export default Order;