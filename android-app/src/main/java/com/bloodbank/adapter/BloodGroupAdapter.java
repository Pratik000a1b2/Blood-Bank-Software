package com.bloodbank.adapter;

import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.bloodbank.R;
import com.bloodbank.model.BloodGroupModel;
import com.google.android.material.card.MaterialCardView;

import java.util.List;

public class BloodGroupAdapter extends RecyclerView.Adapter<BloodGroupAdapter.ViewHolder> {

    private final Context context;
    private final List<BloodGroupModel> bloodGroupList;
    private final OnItemClickListener listener;

    public interface OnItemClickListener {
        void onItemClick(BloodGroupModel item);
    }

    public BloodGroupAdapter(Context context, List<BloodGroupModel> bloodGroupList, OnItemClickListener listener) {
        this.context = context;
        this.bloodGroupList = bloodGroupList;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_blood_group, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        BloodGroupModel item = bloodGroupList.get(position);
        holder.tvGroupName.setText(item.getBloodGroup());
        holder.tvUnits.setText(item.getAvailableUnits() + " Units");

        if (item.getAvailableUnits() == 0) {
            holder.tvStatus.setText("Out of Stock");
            holder.tvStatus.setTextColor(Color.parseColor("#DC2626"));
        } else if (item.getAvailableUnits() < 10) {
            holder.tvStatus.setText("Low Stock");
            holder.tvStatus.setTextColor(Color.parseColor("#D97706"));
        } else {
            holder.tvStatus.setText("Available");
            holder.tvStatus.setTextColor(Color.parseColor("#16A34A"));
        }

        holder.card.setOnClickListener(v -> {
            if (listener != null) {
                listener.onItemClick(item);
            }
        });
    }

    @Override
    public int getItemCount() {
        return bloodGroupList.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        MaterialCardView card;
        TextView tvGroupName;
        TextView tvUnits;
        TextView tvStatus;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            card = itemView.findViewById(R.id.card_blood_group);
            tvGroupName = itemView.findViewById(R.id.tv_blood_group_name);
            tvUnits = itemView.findViewById(R.id.tv_available_units);
            tvStatus = itemView.findViewById(R.id.tv_stock_status);
        }
    }
}
