import PropTypes from "prop-types";
import OrderCard from "./OrderCard";

export default function OrderList({
  orders,
  selectedOrderId,
  onSelectOrder,
  statusLabels,
  statusColors,
}) {
  return (
    <div>
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          isSelected={order.id === selectedOrderId}
          onClick={() => onSelectOrder(order.id)}
          statusLabels={statusLabels}
          statusColors={statusColors}
        />
      ))}
    </div>
  );
}

OrderList.propTypes = {
  orders: PropTypes.array.isRequired,
  selectedOrderId: PropTypes.number,
  onSelectOrder: PropTypes.func.isRequired,
  statusLabels: PropTypes.object.isRequired,
  statusColors: PropTypes.object.isRequired,
};
